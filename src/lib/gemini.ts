interface RegistrationData {
    name: string;
    age: number;
    location: string;
    preferredBatch: string;
}

const LOCATION_LABELS: Record<string, string> = {
    kaloor: "Kaloor Branch",
    kalamassery: "Kalamassery Branch",
    bpcl_township: "BPCL Township",
};

export async function generateWelcomeMessage(
    data: RegistrationData
): Promise<string> {
    const locationLabel = LOCATION_LABELS[data.location] || data.location;

    return `A very warm welcome to the Dyuthi Dance Studio family! We are absolutely thrilled to have you join our ${locationLabel} and embark on your dance journey with us.`;
}
