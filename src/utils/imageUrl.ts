const SUPABASE_IMAGE_URL =
    `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images`;

export const getImageUrl = (imageName: string) => {
    return `${SUPABASE_IMAGE_URL}/${imageName}`;
};