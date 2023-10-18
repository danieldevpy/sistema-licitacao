import * as React from 'react';
import { AppBar, Avatar, Box, Container, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Tooltip, Typography, } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { User } from '../../domain/user';

interface SettingsBar {
  name: string;
  to_link?: string;
  to_click?: () => void;
  icon?: React.ReactNode;
}

interface PropsBar {
  user?: User;
  disableAccount?: boolean;
  disableMenu?: boolean;
  menu?: SettingsBar[];
  menuAccount?: SettingsBar[];
  children?: React.ReactNode;
}

function ResponsiveAppBar(props: PropsBar) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const pages: SettingsBar[] = [
    { to_link: "/", name: "Perfil", icon: <AccountCircleIcon fontSize="small" /> },
    { to_link: "/logout", name: "Logout", icon: <LogoutIcon fontSize="small" /> }
  ];

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
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
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
            {props.disableMenu ? null : (
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
            {props.disableMenu ? null : (
              <Menu
                key="menuapp"
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
                  <div key={index + 'nav'}>
                    {page.to_click ? (
                      <MenuItem onClick={page.to_click}>
                        {page.icon ? <ListItemIcon>{page.icon}</ListItemIcon> : null}
                        <Typography textAlign="center">{page.name}</Typography>
                      </MenuItem>
                    ) : null}
                    {page.to_link ? (
                      <Link to={page.to_link} key={index + 'linkNav'}>
                        <MenuItem>
                          {page.icon ? <ListItemIcon>{page.icon}</ListItemIcon> : null}
                          <Typography textAlign="center">{page.name}</Typography>
                        </MenuItem>
                      </Link>
                    ) : null}
                  </div>
                ))}
              </Menu>
            )}
          </Box>
          {props.disableMenu ? null : (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {props.menu?.map((page, index) => (
                <div key={index + 'menu'}>
                  {page.to_click ? (
                    <MenuItem onClick={page.to_click}>
                      {page.icon ? <ListItemIcon>{page.icon}</ListItemIcon> : null}
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ) : null}
                  {page.to_link ? (
                    <Link to={page.to_link} key={index + 'linkMenu'}>
                      <MenuItem>
                        {page.icon ? <ListItemIcon>{page.icon}</ListItemIcon> : null}
                        <Typography textAlign="center">{page.name}</Typography>
                      </MenuItem>
                    </Link>
                  ) : null}
                </div>
              ))}
            </Box>
          )}

          {props.disableAccount ? null : (
            <Box sx={{ flexGrow: 0, display: "flex", gap: 3, alignItems: "center" }}>
              {props.children}
              <Tooltip title="Abrir Configurações">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp">{props.user?.fullname.slice(0, 1)}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px', padding: 10 }}
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
                {pages.map((page, index) => (
                  <div key={index + 'account'}>
                    {page.to_click ? (
                      <MenuItem onClick={page.to_click}>
                        {page.icon ? <ListItemIcon>{page.icon}</ListItemIcon> : null}
                        <Typography textAlign="center">{page.name}</Typography>
                      </MenuItem>
                    ) : null}
                    {page.to_link ? (
                      <Link to={page.to_link} key={index + 'linkAccount'}>
                        <MenuItem>
                          {page.icon ? <ListItemIcon>{page.icon}</ListItemIcon> : null}
                          <Typography textAlign="center">{page.name}</Typography>
                        </MenuItem>
                      </Link>
                    ) : null}
                  </div>
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
