export const unbundleAs = (bundle: any, resourceType: string) => {
  const baseEntry = bundle.entry.find((entry: any) => {
    return entry.resource.resourceType === resourceType;
  });

  // Find all nested keys named "reference" and replace them with the actual resource
  const replaceReferences = (obj: any, depth: number = 0) => {
    if (obj === null || typeof obj !== "object") {
      return obj;
    } else if (obj.reference) {
      const reference = obj.reference;
      const resource = bundle.entry.find((entry: any) => {
        return entry.fullUrl === reference;
      })?.resource;

      return resource;
    } else if (depth < 5) {
      Object.keys(obj).forEach((key) => {
        obj[key] = replaceReferences(obj[key], depth + 1);
      });
    }
    return obj;
  };

  return replaceReferences(baseEntry);
};
