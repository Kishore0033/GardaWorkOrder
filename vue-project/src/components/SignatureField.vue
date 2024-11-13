<template>
    <div>
        <h3>Signature Field</h3>
        <signature-pad ref="signaturePad" :options="options" width="1000" height="300"
            style="border: 1px solid black;"></signature-pad>

        <button @click="clearSignature">Clear</button>
        <button @click="saveSignature">Save</button>
    </div>
</template>

<script>
import SignaturePad from 'vue3-signature-pad';

export default {
    components: {
        SignaturePad,
    },
    data() {
        return {
            options: {
                penColor: 'black',
                backgroundColor: 'white',
            },
        };
    },
    methods: {
        clearSignature() {
            this.$refs.signaturePad.clear();
        },
        saveSignature() {
            const dataURL = this.$refs.signaturePad.saveSignature();
            console.log('Signature Data URL:', dataURL);
        },
    },
};
</script>