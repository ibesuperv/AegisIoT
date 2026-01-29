export function formatMemberSince(dateString) {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    console.log(month, year);
    return `${month} ${year}`;
}