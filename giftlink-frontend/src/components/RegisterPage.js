
const response = await fetch(
    `${urlConfig.backendUrl}/api/auth/register`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            password
        })
    }
);
