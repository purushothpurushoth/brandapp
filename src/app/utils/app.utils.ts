export function generateNumberArray(size: number): number[] {
  return Array.from({ length: size }, (_, index) => index + 1);
}

export function convertToIEmployer(data: any) {
  return {
    emailIds: data?.emailIds || '',
    companyName: data?.companyName || '',
    companyReviewURLOnGlassdoor: data?.companyReviewURLOnGlassdoor || '',
    ratingThreshold: data?.ratingThreshold ? parseInt(data?.ratingThreshold) : 0,
    frequencyOfEmailInDays: data?.frequencyOfEmailInDays ? parseInt(data.frequencyOfEmailInDays) : 0,
  };
}
