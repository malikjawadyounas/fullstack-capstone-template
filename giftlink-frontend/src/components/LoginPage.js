const response = await fetch(
    `${urlConfig.backendUrl}/api/auth/login`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            email,
            password
        })
    }
);
