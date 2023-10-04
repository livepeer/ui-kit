'use server';

import { z } from 'zod';

const createClipSchema = z.object({
  start: z.number({ coerce: true }).positive(),
  end: z.number({ coerce: true }).positive(),
  playbackId: z.string().nonempty(),
});

export const createClip = async (formData: FormData) => {
  const parsed = await createClipSchema.safeParseAsync(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    return {
      success: false,
      error: 'SCHEMA_FAILED',
      detail: parsed.error.formErrors,
    };
  } else {
    // todo handle passing to API
    console.log(parsed.data);

    return {
      success: true,
      data: 'id1234',
    };
  }
};
