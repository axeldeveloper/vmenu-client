import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Image from 'next/image'

const Favorites: React.FC = () => {
  return (
    <Box
      width={1.0}
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Image src="/empty_favorite.svg" width={300} height={300} />
      <Box marginTop={5}>
        <Typography variant="h5" align="center" color="textSecondary">
          Você ainda não tem favoritos
        </Typography>
      </Box>
    </Box>
  )
}

export default Favorites
