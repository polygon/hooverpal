<template>
    <div class="border sigrow" v-bind:class="style">
        <div class="row mt-2 mb-2">
            <div class="col-lg-2"><span class="pl-2">{{ sig.id }}</span></div>
            <div class="col-lg-3">{{ sig.name }}</div>
            <div class="col-lg-2">
                <b v-if="sig.is_bookmarked">YES</b>
                <button class="btn btn-primary" v-else v-on:click="sig.is_bookmarked = true">Bookmark</button>
            </div>
            <div class="col-lg-2">{{ gone_since }}</div>
            <div class="col-lg-2">
                <button class="btn btn-danger" v-on:click="sig.is_removed = true">Remove</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Signature } from '../signature';

@Component
export default class SignatureRow extends Vue {
    @Prop() sig!: Signature;
    gone_since: string = '';
    intervall: any = null;

    get style(): object {
        if (this.sig.is_gone) {
            return {gone: true};
        }
        if (!this.sig.is_bookmarked) {
            return {'need-bm': true};
        }
        return {'active': true};
    }

    private calc_gone_since(): string {
        if (!this.sig.is_gone) {
            return '';
        }

        const tdiff: Date = new Date(Number(new Date()) - Number(this.sig.t_gone));
        const hours = tdiff.getUTCHours();
        const minutes = tdiff.getUTCMinutes();
        const seconds = tdiff.getUTCSeconds();

        if (hours > 0) {
            return `${this.pad_time(hours)}:${this.pad_time(minutes)}:${this.pad_time(seconds)}`;
        } else {
            return `${this.pad_time(minutes)}:${this.pad_time(seconds)}`;
        }
    }

    private pad_time(val: number): string {
        const pad = '00';
        const str = '' + val;
        return pad.substring(0, pad.length - str.length) + str;
    }

    private beforeMount() {
        this.intervall = setInterval(() => {
                this.gone_since = this.calc_gone_since() 
            }, 1000);
    }

    private beforeDestroy() {
        if (this.intervall != null) {
            clearInterval(this.intervall);
        }
    }
}
</script>

<style scoped>
.active {
    background: white;
}

.need-bm {
    background: #ffe799;
}

.gone {
    background: #99f8ff;
}

.sigrow:hover {
    background: lightgray;
}
</style>
