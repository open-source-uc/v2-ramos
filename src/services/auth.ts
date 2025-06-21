export async function getUserDataByToken(token: string): Promise<{ message: string, permissions: string[], id: string } | null> {
    const response = await fetch("https://auth.osuc.dev/api", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        const data: any = await response.json();
        return {
            message: data.message,
            permissions: data.permissions,
            id: data.userId
        };
    }
    return null;
}