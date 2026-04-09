const usersBaseQuery = {
    select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        theme: true,
        accent: true,
        sunday_hours: true,
        monday_hours: true,
        tuesday_hours: true,
        wednesday_hours: true,
        thursday_hours: true,
        friday_hours: true,
        saturday_hours: true,
        created: true,
        updated: true
    }
}

export default usersBaseQuery