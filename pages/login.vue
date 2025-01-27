<script lang="ts" setup>
const mode = ref("signup");
const email = ref("");
const password = ref("");
const name = ref("");

const login = (e: any) => {
  e.preventDefault();
  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.status === 200) {
        navigateTo("/");
      }
    });
};

const signup = (e: any) => {
  e.preventDefault();
  fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
      name: name.value,
    }),
  });
};
</script>
<template>
  <Card class="mx-auto max-w-sm" v-if="mode === 'signin'">
    <CardHeader>
      <CardTitle class="text-2xl"> Login </CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit="login" class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            v-model="email"
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <a href="#" class="ml-auto inline-block text-sm underline">
              Forgot your password?
            </a>
          </div>
          <Input v-model="password" id="password" type="password" required />
        </div>
        <Button type="submit" class="w-full"> Login </Button>
        <Button variant="outline" class="w-full"> Login with Google </Button>
      </form>
      <div class="mt-4 text-center text-sm">
        Don't have an account?
        <button type="button" @click="mode = 'signup'" class="underline">
          Sign up
        </button>
      </div>
    </CardContent>
  </Card>
  <Card class="mx-auto max-w-sm" v-if="mode === 'signup'">
    <CardHeader>
      <CardTitle class="text-xl"> Sign Up </CardTitle>
      <CardDescription>
        Enter your information to create an account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <form @submit="signup" class="grid gap-4">
          <div class="grid gap-2">
            <Label for="first-name">Your name</Label>
            <Input v-model="name" id="first-name" placeholder="Max" required />
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              v-model="email"
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input
              v-model="password"
              placeholder="Password"
              required
              id="password"
              type="password"
            />
          </div>
          <Button type="submit" class="w-full"> Create an account </Button>
          <Button type="button" variant="outline" class="w-full" as-child>
            <a
              href="https://github.com/login/oauth/authorize?client_id=Iv23liAohwVppegWDq5s"
            >
              Sign up with GitHub
            </a>
          </Button>
        </form>
      </div>
      <div class="mt-4 text-center text-sm">
        Already have an account?
        <button href="#" class="underline" @click="mode = 'signin'">
          Sign in
        </button>
      </div>
    </CardContent>
  </Card>
</template>
