<script lang="ts" setup>
import { Form } from 'vee-validate';
import { Post } from '@prisma/client';

definePageMeta({
  middleware: 'auth',
});

const { data: session, signOut } = useAuth();

const { data: stats, refresh: refreshStats } = await useFetch(
  `/api/stats/${session.value?.user.id}`,
);

const { data: posts, refresh: refreshPosts } = await useFetch('/api/posts');

const refresh = async () => {
  await Promise.all([refreshPosts(), refreshStats()]);
};

const onSignOut = async () => {
  await signOut({
    callbackUrl: '/auth/sign-in',
  });
};
</script>

<template lang="pug">
.w-full.flex.justify-center.items-start.pt-8(v-if='session')
  StatsCard.hidden(:stats='stats' class='md:block')
  .w-full.flex.flex-col.gap-8.pb-8(class='xl:pr-8 md:pl-8 mb-[52px]')
    h1.text-4xl.font-bold Welcome, {{ session.user.name }}!
    PostCard(:session='session' @onCreate='refresh')
    h2.text-2xl.font-bold(v-if='posts.length > 0') Latest Posts
    template(v-for='(post, index) in posts' :key='post?.id')
      PostCard(
        v-if='post'
        :session='session'
        v-model='posts[index]'
        @onDelete='refreshStats'
      )
  PopularCard.hidden(class='xl:block')
</template>
