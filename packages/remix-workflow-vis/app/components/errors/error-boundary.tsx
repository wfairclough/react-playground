import { ApiError } from '~/api/errors/api-error';

export function DefaultErrorBoundary({ error }: { error: Error }) {
  if (!(error instanceof ApiError)) {
    return (
      <div>
        <h1>Something went wrong: {error.name}</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Something went wrong: {error.name}</h1>
      <pre>{error.message}</pre>
      <pre>{error.cause?.body!}</pre>
    </div>
  );
}
