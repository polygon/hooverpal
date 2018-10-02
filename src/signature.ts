export interface Signature {
    id: string;
    name: string;
    t_appear: Date;
    t_gone: Date | null;
    is_gone: boolean;
    is_removed: boolean;
    is_bookmarked: boolean;
}

const lineMatcher = new RegExp('([A-Z]{3}-[0-9]{3})\\t([\\w ]*)\\t([\\w ]*)\\t([\\w ]*)\\t.*');

export default function parse_sigs(data: string): Signature[] {
    const sigs: Signature[] = [];
    const lines = data.split('\n');
    let matches = lines.map((line) => lineMatcher.exec(line))
                       .filter((match) => match != null) as RegExpMatchArray[];
    matches = matches.filter((m) => m[2] === 'Cosmic Anomaly')
                     .filter((m) => m[3] === 'Combat Site');
    for (const m of matches) {
        const sig = {id: m[1], name: m[4], t_appear: new Date(), t_gone: null,
                     is_gone: false, is_removed: false, is_bookmarked: false};
        sigs.push(sig);
    }
    return sigs;
}

export function same_sig(s1: Signature, s2: Signature): boolean {
    return (s1.id === s2.id);
}
