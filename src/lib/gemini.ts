interface RegistrationData {
    name: string;
    age: number;
    location: string;
    preferredBatch: string;
}

export async function generateWelcomeMessage(
    data: RegistrationData
): Promise<string> {
    return `A very warm welcome to the Dyuthi Dance Studio family! We are absolutely thrilled to have you join our ${data.location} and embark on your dance journey with us.`;
}
