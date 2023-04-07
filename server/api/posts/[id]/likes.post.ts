import { H3Event } from 'h3';
import { useValidatedBody } from 'h3-zod';
import { getServerSession } from '#auth';

export default defineEventHandler(async (event: H3Event) => {
  const session = await getServerSession(event);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const id = event.context.params?.id;

  await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: { id },
      include: {
        likes: { where: { userId: session.user.id } },
        dislikes: { where: { userId: session.user.id } },
      },
    });

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
      });
    }

    // If the user is the author of the post, forbid them from liking it
    if (post.authorId === session.user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
      });
    }

    // If the user has already liked or disliked the post, forbid them from liking it again
    if (post.likes.length > 0 || post.dislikes.length > 0) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
      });
    }

    const updatedPost = await tx.post.update({
      where: {
        id,
      },
      data: {
        likes: {
          create: {
            userId: session.user.id,
          },
        },
      },
    });
  });

  sendNoContent(event, 201);
});
