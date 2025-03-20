const Role = require('../schemas/RoleSchema');

const roles = [
    { name: 'ADMIN' },
    { name: 'USER' }
];

async function seedRoles() {
    try {
        for (const roleData of roles) {
            try {
                // Check if role already exists
                const existingRole = await Role.findOne({ name: roleData.name });

                if (!existingRole) {
                    const role = new Role({ name: roleData.name }); // Create new instance
                    await role.save(); // Save to database
                    console.log(`✓ Role ${roleData.name} seeded successfully`);
                } else {
                    console.log(`ℹ Role ${roleData.name} already exists`);
                }
            } catch (roleError) {
                console.error(`✗ Error seeding role ${roleData.name}:`, roleError.message);
            }
        }
    } catch (error) {
        console.error('✗ Database connection error:', error.message);
        throw error;
    }
}

module.exports = seedRoles;
