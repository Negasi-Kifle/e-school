import AppError from "../../../utils/app_error";
import ISchoolDoc from "../../schools/dto";
import IUsersDoc from "../../users/dto";

/**
 * Checks if the logged in user owns/belongs to the school
 * @param loggedInUser document of the logged in user
 * @param tenantId document id of the school/tenant
 */
export default function (loggedInUser: IUsersDoc, tenant: ISchoolDoc) {
  const rolesInTenant = ["Director", "Teacher", "Assitant"]; // Roles in tenant

  // Non-owner user
  if (
    rolesInTenant.includes(loggedInUser.role) &&
    loggedInUser.tenant_id !== tenant.owner
  ) {
    throw new AppError("You don't belong to this school", 400);
  }

  // Owner
  if (
    loggedInUser.role === "Owner" &&
    loggedInUser.id.toString() !== tenant.owner.toString()
  ) {
    throw new AppError("You don't own this school", 400);
  }
}
