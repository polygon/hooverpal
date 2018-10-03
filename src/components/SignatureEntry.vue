<template>
    <div class="mt-3">
        <div class="form-group">
            <label for="pasteBox">Paste signature list here</label>
            <textarea class="form-control" id="pasteBox"
                      rows="8" v-model="paste" v-on:paste.stop="pasted"></textarea>
        </div>
        <button class="btn btn-primary" v-on:click="analyze()">Analyze</button>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import parse_sigs from '../signature';
import { Signature } from '../signature';

@Component
export default class SignatureEntry extends Vue {
    private paste: string;

    constructor() {
        super();
        this.paste = '';
    }

    private analyze() {
        const sigs = parse_sigs(this.paste);
        if (sigs.length > 0) {
            this.emit_new_sigs(sigs);
            window.scrollTo(0, 0);
        }
    }

    private pasted(e: ClipboardEvent) {
        this.$nextTick(this.analyze);
    }

    @Emit('newSigs')
    private emit_new_sigs(sigs: Signature[]) {
        this.paste = '';
    }
}
</script>

<style scoped>
</style>
