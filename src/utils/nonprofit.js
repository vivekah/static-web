const isInKindNonprofits = [
    163
]

function isInKind (nonprofitID) {
    return isInKindNonprofits.includes(nonprofitID)
}

export default {
    isInKind
}