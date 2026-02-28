const ordinalRules = new Intl.PluralRules('en-US', { type: 'ordinal' });
const ordinalSuffixes = { zero: 'th', many: 'th', one: 'st', two: 'nd', few: 'rd', other: 'th' };

function useDateFormat() {
    return (date: Date) => {
        const day = date.getUTCDate();
        const suffix = ordinalSuffixes[ordinalRules.select(day)] ?? 'th';
        const month = date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
        const year = date.getUTCFullYear();

        return `${month} ${day}${suffix}, ${year}`;
    };
}

export default useDateFormat;