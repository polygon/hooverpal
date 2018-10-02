<template>
    <div class="border">
        <div class="row">
            <div class="col-lg-2"><b class="pl-2">ID</b></div>
            <div class="col-lg-3"><b>Name</b></div>
            <div class="col-lg-2"><b>Bookmarked</b></div>
            <div class="col-lg-2"><b>Gone since</b></div>
            <div class="col-lg-2"><b>Remove</b></div>
        </div>
        <SignatureRow v-for="sig in gone_sigs" v-bind:key="sig.id" v-bind:sig="sig"></SignatureRow>
        <SignatureRow v-for="sig in needbm_sigs" v-bind:key="sig.id" v-bind:sig="sig"></SignatureRow>
        <SignatureRow v-for="sig in active_sigs" v-bind:key="sig.id" v-bind:sig="sig"></SignatureRow>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SignatureRow from './SignatureRow.vue';
import { Signature } from '../signature';

@Component({
  components: {
    SignatureRow
  },
})
export default class SignatureList extends Vue {
    @Prop() sigs!: Signature[];

    get gone_sigs(): Signature[] {
        let gs = this.sigs.filter((sig) => {
            if (sig.is_removed) { return false; }
            return sig.is_gone;
        });
        return this.sort_sigs(gs);
    }

    get active_sigs(): Signature[] {
        let as = this.sigs.filter((sig) => {
            if (sig.is_removed) { return false; }
            return (!sig.is_gone) && (sig.is_bookmarked);
        });
        return this.sort_sigs(as);
    }

    get needbm_sigs(): Signature[] {
        let nb = this.sigs.filter((sig) => {
            if (sig.is_removed) { return false; }
            return (!sig.is_bookmarked);
        });
        return this.sort_sigs(nb);
    }

    private sort_sigs(sigs: Signature[]): Signature[] {
        return sigs.sort((a, b) => {
            if (a.id < b.id) { return -1; }
            else if (a.id > b.id) { return 1; }
            return 0;
        })
    }
}
</script>

<style scoped>
</style>
