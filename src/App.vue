<template>
  <div id="app" class="container">
    <h1>Hooverpal</h1>
    <p>Ninja Salvaging Extraordinaire</p>
    <div class="mb-2 mt-2">
      <button class="btn btn-primary mr-2" v-on:click="mark_all()">Bookmark All</button>
      <button class="btn btn-danger" v-on:click="sigs=[]">Clear all</button>
    </div>
    <SignatureList v-if="sigs.length > 0" v-bind:sigs="sigs"/>
    <SignatureEntry v-on:newSigs="new_sigs"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SignatureList from './components/SignatureList.vue';
import SignatureEntry from './components/SignatureEntry.vue';
import { Signature, same_sig } from './signature';

@Component({
  components: {
    SignatureList,
    SignatureEntry,
  },
})
export default class App extends Vue {
  private sigs: Signature[] = [];

  private new_sigs(newsigs: Signature[]) {
    const gone = [];
    const active = [];
    for (const sig of this.sigs) {
      let found = false;
      for (const id in newsigs) {
        if (same_sig(sig, newsigs[id])) {
          found = true;
          newsigs.splice(Number(id), 1);
          break;
        }
      }
      if (found) {
        active.push(sig);
      } else {
        gone.push(sig);
      }
    }

    this.handle_fresh(newsigs);
    this.handle_active(active);
    this.handle_gone(gone);
    this.purge();
  }

  private handle_fresh(fresh: Signature[]) {
    // Fresh sigs are just appended to the already existing list
    this.sigs = this.sigs.concat(fresh);
  }

  private handle_active(active: Signature[]) {
    // Check if the sig was gone, the user may not have copied
    // Everything, just re-set the state to active
    for (const sig of active) {
      if (sig.is_gone) {
        sig.is_gone = false;
        sig.t_gone = null;
      }
    }
  }

  private handle_gone(gone: Signature[]) {
    // If the sig wasn't already gone, mark it as such and
    // record the time when the signature was gone at first
    for (const sig of gone) {
      if (!sig.is_gone) {
        sig.is_gone = true;
        sig.t_gone = new Date();
      }
    }
  }

  private purge() {
    // Purge sigs that are gone and have not been bookmarked yet
    this.sigs = this.sigs.filter((sig) => {
      if (sig.is_gone) {
        // Sigs that have not been bookmarked so far can be immediately
        // discarded, should the user have not copied it in error, it will
        // just reappear on the next scan
        if (!sig.is_bookmarked) { return false; }

        // If the sig is gone for more than two hours, discard it
        if (Number(new Date()) - Number(sig.t_gone!) > 7200000) { return false; }
      }

      return true;
    });
  }

  private mark_all() {
    // Bookmark all signatures at once
    for (const sig of this.sigs) {
      sig.is_bookmarked = true;
    }
  }
}
</script>

<style>

</style>
