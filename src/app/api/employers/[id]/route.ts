import { getAppContext } from "@/lib/db/app-store";
import { employerUpdateSchema } from "@/lib/validation/schemas";
import { fail, ok } from "@/lib/utils/responses";

function normalizeNullableValue(value?: string | null) {
  return value === "" ? null : value;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { services } = getAppContext();
  const detail = services.employers.getDetail(id);

  if (!detail) {
    return fail("Arbeitgeber nicht gefunden", "NOT_FOUND", 404);
  }

  return ok(detail);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const input = employerUpdateSchema.parse(body);
    const { id } = await params;
    const { services } = getAppContext();
    const updated = services.employers.update(id, {
      website: normalizeNullableValue(input.website),
      careersUrl: normalizeNullableValue(input.careersUrl),
      contactEmail: normalizeNullableValue(input.contactEmail),
      phone: normalizeNullableValue(input.phone),
      address: normalizeNullableValue(input.address),
      linkedinUrl: normalizeNullableValue(input.linkedinUrl),
      notes: input.notes,
    });

    if (!updated) {
      return fail("Arbeitgeber nicht gefunden", "NOT_FOUND", 404);
    }

    return ok(updated);
  } catch (error) {
    return fail("Arbeitgeber konnte nicht aktualisiert werden", "VALIDATION_ERROR", 400, error);
  }
}
