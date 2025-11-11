// Role definitions and permissions

const ROLES = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin'
};

const PERMISSIONS = {
    // Material permissions
    UPLOAD_MATERIAL: 'upload_material',
    DOWNLOAD_MATERIAL: 'download_material',
    DELETE_OWN_MATERIAL: 'delete_own_material',
    DELETE_ANY_MATERIAL: 'delete_any_material',
    VERIFY_MATERIAL: 'verify_material',
    
    // User permissions
    VIEW_USERS: 'view_users',
    MANAGE_USERS: 'manage_users',
    DELETE_USERS: 'delete_users',
    
    // Group permissions
    CREATE_GROUP: 'create_group',
    JOIN_GROUP: 'join_group',
    MANAGE_GROUP: 'manage_group',
    
    // System permissions
    VIEW_ANALYTICS: 'view_analytics',
    MANAGE_SYSTEM: 'manage_system'
};

// Role-Permission mapping
const ROLE_PERMISSIONS = {
    [ROLES.STUDENT]: [
        PERMISSIONS.UPLOAD_MATERIAL,
        PERMISSIONS.DOWNLOAD_MATERIAL,
        PERMISSIONS.DELETE_OWN_MATERIAL,
        PERMISSIONS.CREATE_GROUP,
        PERMISSIONS.JOIN_GROUP
    ],
    
    [ROLES.TEACHER]: [
        PERMISSIONS.UPLOAD_MATERIAL,
        PERMISSIONS.DOWNLOAD_MATERIAL,
        PERMISSIONS.DELETE_OWN_MATERIAL,
        PERMISSIONS.VERIFY_MATERIAL,
        PERMISSIONS.CREATE_GROUP,
        PERMISSIONS.JOIN_GROUP,
        PERMISSIONS.MANAGE_GROUP,
        PERMISSIONS.VIEW_ANALYTICS
    ],
    
    [ROLES.ADMIN]: [
        ...Object.values(PERMISSIONS) // Admin has all permissions
    ]
};

// Check if role has permission
const hasPermission = (role, permission) => {
    return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

// Check if role can access resource
const canAccessResource = (userRole, resourceOwnerRole, resourceOwnerId, userId) => {
    // Admin can access everything
    if (userRole === ROLES.ADMIN) return true;
    
    // Users can access their own resources
    if (resourceOwnerId === userId) return true;
    
    // Students can access teacher materials
    if (userRole === ROLES.STUDENT && resourceOwnerRole === ROLES.TEACHER) return true;
    
    // Students can access other student materials (peer sharing)
    if (userRole === ROLES.STUDENT && resourceOwnerRole === ROLES.STUDENT) return true;
    
    // Teachers can access all materials
    if (userRole === ROLES.TEACHER) return true;
    
    return false;
};

module.exports = {
    ROLES,
    PERMISSIONS,
    ROLE_PERMISSIONS,
    hasPermission,
    canAccessResource
};
