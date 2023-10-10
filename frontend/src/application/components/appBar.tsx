import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Logo from "../assets/img/logo.png"
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/router';
import { User } from '@/domain/entity/user';


export interface SettingsBar{
    name: string;
    onClick: any;
    isAdm?: boolean
}


interface PropsBar{
  user?: User;
  disableAccount?: boolean;
  disableMenu?: boolean;
  menu?: SettingsBar[];
  children?: any;
}

function ResponsiveAppBar(props: PropsBar) {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [settings, setSettings] = React.useState<SettingsBar[]>([
    {name: "Perfil", onClick: ()=>{}},
    {name: "Sair", onClick: ()=>{router.push('/logout')}},
  ])


  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
        <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',

            }}
          >
            CISBAF
          </Typography>
         
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            
            {props.disableMenu? (null):(
              
              <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            )}
            {props.disableMenu? (null):(
              <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {props.menu?.map((page, index) => (
                <MenuItem key={index} onClick={()=>{
                  page.onClick();
                  handleCloseNavMenu();
                }}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
            )}
          </Box>
          {props.disableMenu? (null):(
            
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
         
              {props.menu?.map((page, index) => (
              <Box key={index}>
                {page.isAdm? (
                    <Button
                    key={index}
                    onClick={page.onClick}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page.name}
                  </Button>
                ):(null)}
                </Box>
            ))}
          </Box>
          )}

        {props.disableAccount?(null):(
          <Box sx={{ flexGrow: 0, display: "flex", gap: 3, alignItems: "center"}}>
            {props.children}
          <Tooltip title="Abrir Configurações">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" >{props.user?.fullname.slice(0,1)}</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting, index) => (
              <MenuItem key={index} onClick={setting.onClick}>
                <Typography textAlign="center">{setting.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
          </Box>
        )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;