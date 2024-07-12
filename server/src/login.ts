var domain: string;

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm') as HTMLFormElement;
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        const errorMessage = document.getElementById('error-message') as HTMLElement;

        if (await authenticateUser(username, password)) {
            window.location.href = domain + 'admin.html';
        } else {
            errorMessage.textContent = 'Invalid username or password';
        }
    });
});

async function authenticateUser(username: string, password: string): Promise<boolean> {
	try {

		const response = await fetch(`http://localhost:3000/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username: username, password: password })
		});

		if (!response.ok) {
			throw new Error('Failed to authenticate');
		}

		domain = await response.text();
		console.log(domain);
		return true;
	} catch (error) {
		console.error('Error during authentication:', error);
		return false;
	}
}
