export default function Home() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=/la-brasserie-demo" />
        <script dangerouslySetInnerHTML={{
          __html: `window.location.href = '/la-brasserie-demo'`
        }} />
      </head>
      <body>
        <p>Redirection...</p>
      </body>
    </html>
  );
}
