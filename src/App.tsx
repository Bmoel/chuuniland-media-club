import { createTheme, MantineProvider } from "@mantine/core";

function App() {
  const theme = createTheme({});

  return (
    <MantineProvider theme={theme}>
      <p>Testing</p>
    </MantineProvider>
  );
}

export default App;
