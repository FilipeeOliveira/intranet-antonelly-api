import { CommuniquesFeatures } from './communiques.features';
import { CompanyFeatures } from './companies.features';
import { DocumentsFeatures } from './documents.features';
import { MeetingFeatures } from './meeting.features';
import { PermissionsFeatures } from './permissions.features';
import { RoomsFeatures } from './rooms.features';
import { SectorsFeatures } from './sectors.features';
import { UserFeatures } from './users.features';
import { VisitHistoryFeatures, VisitPresentsFeatures, VisitScheduleFeatures } from './visit-history.features';

export const Permissions = {
    COMPANIES: CompanyFeatures,
    COMMUNIQUES: CommuniquesFeatures,
    VISIT_PRESENTS: VisitPresentsFeatures,
    VISIT_SCHEDULES: VisitScheduleFeatures,
    VISIT_HISTORY: VisitHistoryFeatures,
    DOCUMENTS: DocumentsFeatures,
    MEETINGS: MeetingFeatures,
    SECTORS: SectorsFeatures,
    ROOMS: RoomsFeatures,
    USERS: UserFeatures,
    PERMISSIONS: PermissionsFeatures,
} as const;

export type PermissionKey =
    | typeof CompanyFeatures[keyof typeof CompanyFeatures]
    | typeof VisitScheduleFeatures[keyof typeof VisitScheduleFeatures]
    | typeof DocumentsFeatures[keyof typeof DocumentsFeatures]
    | typeof MeetingFeatures[keyof typeof MeetingFeatures]
    | typeof SectorsFeatures[keyof typeof SectorsFeatures]
    | typeof RoomsFeatures[keyof typeof RoomsFeatures]
    | typeof UserFeatures[keyof typeof UserFeatures]
    | typeof PermissionsFeatures[keyof typeof PermissionsFeatures]
    | typeof VisitHistoryFeatures[keyof typeof VisitHistoryFeatures]
    | typeof VisitPresentsFeatures[keyof typeof VisitPresentsFeatures]
    | typeof CommuniquesFeatures[keyof typeof CommuniquesFeatures];
    

export type FeatureGroup = keyof typeof Permissions;

export const FeatureGroups = Object.keys(Permissions) as FeatureGroup[];
export const AllPermissions = Object.values(Permissions).flatMap((feature) => Object.values(feature));