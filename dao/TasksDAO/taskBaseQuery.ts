const taskBaseQuery = {
    select: {
        id: true,
        name: true,
        notes: true,
        description: true,
        duration: true,
        steps: {
            select: {
                id: true,
                name: true,
                notes: true,
                duration: true
            }
        },
        deadline: true,
        created: true,
        updated: true
    }
}

export default taskBaseQuery