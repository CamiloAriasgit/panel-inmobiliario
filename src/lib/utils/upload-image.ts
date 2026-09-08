import { createClient } from "@/lib/supabase/client";

export async function uploadPropertyImage(
  file: File,
  agencyId: string,
  propertyId: string
): Promise<string> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const path = `${agencyId}/${propertyId}/${fileName}`;

  const { error } = await supabase.storage
    .from("property-images")
    .upload(path, file);

  if (error) {
    throw new Error("No se pudo subir la imagen.");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("property-images").getPublicUrl(path);

  return publicUrl;
}