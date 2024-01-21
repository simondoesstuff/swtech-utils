import {evidenceIndexQuery, evidenceTokenQuery, tokenIdFreq, tokenIdFreqMany} from './could_align';

describe('identifying tokens', () => {
    test('no tokens', () => {
        const tokens = tokenIdFreq('', 1);
        expect(tokens.size).toBe(0);
        const tokens2 = tokenIdFreq('hello', 6);
        expect(tokens2.size).toBe(0);
    });

    test('small tokens', () => {
        const tokens = tokenIdFreq('abcd', 1);
        expect(tokens.size).toBe(4);
        expect(tokens.get('a')).toBe(1);
        expect(tokens.get('b')).toBe(1);
        expect(tokens.get('c')).toBe(1);
        expect(tokens.get('d')).toBe(1);
    });

    test('one big token', () => {
        const input = 'hello world!'
        const tokens = tokenIdFreq(input, input.length);
        expect(tokens.size).toBe(1);
        expect(tokens.get(input)).toBe(1);
    });

    test('big tokens', () => {
        const tokens = tokenIdFreq('abcde', 3);
        // expecting abcde =>  abc bcd cde
        expect(tokens.size).toBe(3);
        expect(tokens.get('abc')).toBe(1);
        expect(tokens.get('bcd')).toBe(1);
        expect(tokens.get('cde')).toBe(1);
    });

    test('higher frequency tokens', () => {
        const tokens = tokenIdFreq('cacacac', 3);
        // expecting cacacac => cac aca cac aca cac
        expect(tokens.size).toBe(2);
        expect(tokens.get('cac')).toBe(3);
        expect(tokens.get('aca')).toBe(2);
    })

    test('multiple sources of evidence', () => {
        const tokens = tokenIdFreqMany(['hello', 'world'], 1)
        expect(tokens.size).toBe(7);
        expect(tokens.get('h')).toBe(1);
        expect(tokens.get('e')).toBe(1);
        expect(tokens.get('l')).toBe(3);
        expect(tokens.get('o')).toBe(2);
        expect(tokens.get('w')).toBe(1);
        expect(tokens.get('r')).toBe(1);
        expect(tokens.get('d')).toBe(1);
    })
});

describe('comparing evidence', () => {
    test('evidence query zeros', () => {
        const size = 2;
        const evidence = tokenIdFreqMany(['hello', 'lowor', 'world'], size);
        const map = evidenceTokenQuery('hello world!', evidence, size);
        expect(map.size).toBe(11);
        expect(map.get('o ')).toBe(0);
        expect(map.get(' w')).toBe(0);
        expect(map.get('d!')).toBe(0);
    })

    test('evidence query indices, singles', () => {
        const size = 1;
        const evidence = tokenIdFreqMany(['pa', 'ra', 'dox'], size);
        const map = evidenceIndexQuery('paradox', evidence, size);

        for (const i of map) {
            expect(i).toBe(1);
        }
    });

    test('evidence query indices, doubles', () => {
        const size = 2;
        const evidence = tokenIdFreqMany(['par', 'adox'], size);
        const map = evidenceIndexQuery('paradox', evidence, size);

        expect(map[0]).toBe(1);
        expect(map[1]).toBe(1);
        expect(map[2]).toBe(0.5);
        expect(map[3]).toBe(0.5);
        expect(map[4]).toBe(1);
        expect(map[5]).toBe(1);
    });
});