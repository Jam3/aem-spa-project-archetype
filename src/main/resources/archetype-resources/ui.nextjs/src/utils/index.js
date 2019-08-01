/**
 * Extract an id from the cqModel field of given properties
 *
 * @param path     - Path to be converted into an id
 * @returns {string|undefined}
 */
export function extractModelId (path) {
    return path && path.replace(/\/|:/g, '_');
}

export function isBrowser() {
    try {
        return typeof window !== 'undefined';
    } catch (e) {
        return false;
    }
}

let model = null;
export const getRootModel = () => {
    return model;
};

export const setRootModel = (data) => {
    model = data;
};

export const isInEditor = (req) => {
    const wcmMode = req.headers['wcm-mode'];
    return wcmMode && wcmMode === 'EDIT' || wcmMode === 'PREVIEW';
};