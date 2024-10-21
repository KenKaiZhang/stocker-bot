db.createUser(
    {
        user: "tmpUser",
        pwd: "tmpUserPass",
        roles: [
            {
                role: "readWrite",
                db: "endor"
            }
        ]
    }
)