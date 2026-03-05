import { CommuniquesFeatures } from "./communiques.features";
import { CompanyFeatures } from "./companies.features";
import { ConstructionsFeatures } from "./constructions.features";
import { DocumentsFeatures } from "./documents.features";
import { OrdersFeatures } from "./orders.features";
import { MeetingFeatures } from "./meeting.features";
import { PermissionsFeatures } from "./permissions.features";
import { RoomsFeatures } from "./rooms.features";
import { SectorsFeatures } from "./sectors.features";
import { UserFeatures } from "./users.features";
import { VisitHistoryGeneralFeatures } from "./visit-history.features";

export const Permissions = {
  COMPANIES: CompanyFeatures,
  COMMUNIQUES: CommuniquesFeatures,
  CONSTRUCTIONS: ConstructionsFeatures,
  VISIT_HISTORY_GENERAL: VisitHistoryGeneralFeatures,
  DOCUMENTS: DocumentsFeatures,
  MEETINGS: MeetingFeatures,
  SECTORS: SectorsFeatures,
  ROOMS: RoomsFeatures,
  USERS: UserFeatures,
  PERMISSIONS: PermissionsFeatures,
  ORDERS: OrdersFeatures,
} as const;

export type PermissionKey =
  | (typeof CompanyFeatures)[keyof typeof CompanyFeatures]
  | (typeof ConstructionsFeatures)[keyof typeof ConstructionsFeatures]
  | (typeof DocumentsFeatures)[keyof typeof DocumentsFeatures]
  | (typeof MeetingFeatures)[keyof typeof MeetingFeatures]
  | (typeof SectorsFeatures)[keyof typeof SectorsFeatures]
  | (typeof RoomsFeatures)[keyof typeof RoomsFeatures]
  | (typeof UserFeatures)[keyof typeof UserFeatures]
  | (typeof PermissionsFeatures)[keyof typeof PermissionsFeatures]
  | (typeof VisitHistoryGeneralFeatures)[keyof typeof VisitHistoryGeneralFeatures]
  | (typeof CommuniquesFeatures)[keyof typeof CommuniquesFeatures]
  | (typeof OrdersFeatures)[keyof typeof OrdersFeatures];

export type FeatureGroup = keyof typeof Permissions;

export const FeatureGroups = Object.keys(Permissions) as FeatureGroup[];
export const AllPermissions = Object.values(Permissions).flatMap((feature) => Object.values(feature));
