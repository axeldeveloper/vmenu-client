import { useContext, useState } from 'react'

import { useRouter } from 'next/router'
import Image from 'next/image'

import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import Add from '@material-ui/icons/Add'
import Remove from '@material-ui/icons/Remove'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'

import useTheme from '@material-ui/core/styles/useTheme'

import { GetStaticPaths, GetStaticProps } from 'next'
import Product from '@domain/entities/Product'
import { currencyConvertion } from '@presentation/utils/Conversions'
import GetProduct from '@domain/usecases/products/GetProduct'
import OrderContext from '@domain/utils/OrderContext'
import OrderItem from '@domain/entities/OrderItem'
import GetProducts from '@domain/usecases/products/GetProducts'

const useStyles = makeStyles((theme: Theme) => ({
  productImage: {
    objectFit: 'cover',
    borderRadius: '50%'
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  productDescription: {
    marginTop: theme.spacing(2),
    fontSize: 16,
    fontWeight: 'normal',
    color: theme.palette.text.secondary
  },
  productPrice: {
    fontWeight: 'normal',
    fontSize: 18,
    marginTop: theme.spacing(2)
  },
  addProductButton: {
    display: 'flex',
    justifyContent: 'space-between',
    textTransform: 'none',
    borderRadius: theme.spacing(1)
  },
  addBackgroun: {
    backgroundColor: theme.palette.background.paper
  }
}))
const ProductDetail: React.FC<{ product: Product }> = ({ product }) => {
  const [quantity, setQuantity] = useState(0)
  const [observation, setObservations] = useState('')
  const classes = useStyles()
  const theme = useTheme()
  const router = useRouter()
  const orderStore = useContext(OrderContext)

  const onAddItemClicked = () => {
    const newOrder: OrderItem = {
      id: Math.floor(Math.random() * 100) + product.id,
      product,
      observation,
      quantity
    }
    orderStore.changeItens([...orderStore.order, newOrder])
    router.back()
  }

  return (
    <Box>
      <Box display="flex" flexDirection="column" paddingBottom={14}>
        <AppBar position="sticky" color="inherit" elevation={0}>
          <Toolbar>
            <IconButton
              color="primary"
              edge="start"
              onClick={() => router.back()}
            >
              <ArrowBackIos />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          display="flex"
          justifyContent="center"
          flexGrow={1}
          paddingX={2}
          marginTop={3}
        >
          {product?.images[0]?.url && (
            <Image
              src={product?.images[0].url}
              width={250}
              height={250}
              className={classes.productImage}
            />
          )}
        </Box>
        <Box display="flex" flexDirection="column" paddingX={2} marginTop={3}>
          <Typography className={classes.productName}>
            {product?.name}
          </Typography>
          <Typography className={classes.productDescription}>
            {product?.description}
          </Typography>
          <Typography className={classes.productPrice}>
            {currencyConvertion(product?.price)}
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            flex={1}
            marginTop={4}
            marginBottom={1}
          >
            <Typography color="textSecondary" variant="subtitle1">
              Alguma Observação ?
            </Typography>
            <Typography color="textSecondary" variant="subtitle1">
              {observation.length}/144
            </Typography>
          </Box>
          <TextField
            variant="outlined"
            placeholder="Ex:sem maionese, sem picles etc."
            multiline
            value={observation}
            onChange={e => setObservations(e.target.value)}
            inputProps={{ maxLength: 140 }}
          />
        </Box>
      </Box>
      <Box
        position="fixed"
        bottom={0}
        right={0}
        width={1.0}
        zIndex={2}
        className={classes.addBackgroun}
      >
        <Box
          padding={2}
          display="flex"
          width={1.0}
          justifyContent="space-between"
        >
          <Box
            display="flex"
            justifyContent="space-evenly"
            alignItems="center"
            border="1px solid"
            borderRadius={8}
            borderColor={theme.palette.text.disabled}
            marginRight={2}
          >
            <IconButton
              color="primary"
              disabled={quantity <= 0}
              onClick={() => setQuantity(quantity - 1)}
            >
              <Remove />
            </IconButton>
            <Typography variant="subtitle1">{quantity}</Typography>
            <IconButton
              color="primary"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Add />
            </IconButton>
          </Box>
          <Button
            onClick={onAddItemClicked}
            disabled={quantity <= 0}
            variant="contained"
            color="primary"
            fullWidth
            disableElevation
            className={classes.addProductButton}
          >
            <span>Adicionar</span>{' '}
            <span>{currencyConvertion(product?.price * quantity)}</span>
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default ProductDetail

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await GetProducts()
  const ids = products.map(product => ({
    params: { item: String(product.id) }
  }))

  return {
    paths: ids,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async context => {
  const { item } = context.params
  const data = await GetProduct(Number(item))

  return {
    props: { product: data },
    revalidate: 10
  }
}
