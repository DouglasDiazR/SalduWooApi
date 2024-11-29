export const formatDate = (
    date?: string,
    endDay: boolean = false,
): string | undefined => {
    if (!date) return undefined
    return new Date(
        `${date}${endDay ? 'T23:59:59Z' : 'T00:00:00Z'}`,
    ).toISOString()
}
