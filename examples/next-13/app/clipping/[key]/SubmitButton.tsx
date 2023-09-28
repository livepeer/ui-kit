'use client';

import { Button } from '@livepeer/design-system';

import { ComponentPropsWithRef } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export function SubmitButton(props: ComponentPropsWithRef<typeof Button>) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} type="submit" disabled={pending || props.disabled} />
  );
}
