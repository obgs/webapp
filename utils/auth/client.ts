interface SignInResponse {
  access_token: string;
  refresh_token: string;
}

interface AuthClient {
  signIn: (email: string, password: string) => Promise<SignInResponse>;
  signUp: (email: string, password: string) => Promise<SignInResponse>;
  oAuthGoogleSignin: (token: string) => Promise<SignInResponse>;
}

const apiURL = process.env.NEXT_PUBLIC_API_URL;

const client: AuthClient = {
  signIn: async (email, password) => {
    const response = await fetch(`${apiURL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `email=${email}&password=${password}`,
    });
    switch (response.status) {
      case 200:
        const json = (await response.json()) as SignInResponse;
        if (!json.access_token || !json.refresh_token) {
          throw new Error("Failed to sign in");
        }
        return json;
      case 401:
        throw new Error("Invalid email or password");
      case 404:
        throw new Error("User not found");
      default:
        throw new Error("Something went wrong");
    }
  },
  signUp: async (email, password) => {
    const response = await fetch(`${apiURL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `email=${email}&password=${password}`,
    });
    switch (response.status) {
      case 201:
        const json = (await response.json()) as SignInResponse;
        if (!json.access_token || !json.refresh_token) {
          throw new Error("Failed to sign in");
        }
        return json;
      case 409:
        throw new Error("User with this email already exists");
      default:
        throw new Error("Something went wrong");
    }
  },
  oAuthGoogleSignin: async (token) => {
    const response = await fetch(`${apiURL}/auth/google/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `token=${token}`,
    });
    switch (response.status) {
      case 200:
        const json = (await response.json()) as SignInResponse;
        if (!json.access_token || !json.refresh_token) {
          throw new Error("Failed to sign in");
        }
        return json;
      default:
        throw new Error("Something went wrong");
    }
  }
};

export default client;
