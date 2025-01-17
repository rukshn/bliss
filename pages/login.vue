<script lang="ts" setup>
const email = ref("");
const password = ref("");
const name = ref("");
const signup = (e) => {
  e.preventDefault();
  console.log({
    email: email.value,
    password: password.value,
    name: name.value,
  });
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
  <Card class="mx-auto max-w-sm">
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
            <Input v-model="password" required id="password" type="password" />
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
        <a href="#" class="underline"> Sign in </a>
      </div>
    </CardContent>
  </Card>
</template>
