const GALLERY_PREFIX = 'gallery_';

export const saveImage = (userEmail: string, imageUrl: string): void => {
    const key = `${GALLERY_PREFIX}${userEmail}`;
    const images = getImages(userEmail);
    // Add the new image to the beginning of the array
    images.unshift(imageUrl);
    localStorage.setItem(key, JSON.stringify(images));
};

export const getImages = (userEmail: string): string[] => {
    const key = `${GALLERY_PREFIX}${userEmail}`;
    const images = localStorage.getItem(key);
    return images ? JSON.parse(images) : [];
};
