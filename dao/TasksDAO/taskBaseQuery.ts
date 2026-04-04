const taskBaseQuery = {
    select: {
        id: true,
        name: true,
        notes: true,
        description: true,
        steps: {
            select: {
                id: true,
                name: true,
                notes: true,
                duration: true
            }
        },
        created: true,
        updated: true
    }
}

export default taskBaseQuery