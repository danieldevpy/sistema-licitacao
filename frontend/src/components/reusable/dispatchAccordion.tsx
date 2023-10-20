import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import Dispatch from '../../domain/dispatch';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { ApiConfig } from '../../application/infra/api/apiconfig';


interface AccordionProps{
    dispatchs: Dispatch[];
}

export default function DispatchAccordion(props: AccordionProps) {
  const api = new ApiConfig();
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      event
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box className="accordionindex">
      {props.dispatchs.map((dispatch, index)=>(
        <Accordion 
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
          style={{backgroundColor: dispatch.status?"#f5fff5":"#fff3f3"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Box sx={{display: "flex", gap: 1, justifyContent: "space-around", alignItems: "center", width: "100%"}}>
            <Typography color={"#323232"} sx={{width: "40%", flexShrink: 0 }}>
              {dispatch.from_sector}
            </Typography>
            {dispatch.status?(
              <>
              <Typography color={"#323232"}>{'>'}</Typography>
              <Typography color={"#323232"} sx={{width: "45%"}}>{dispatch.to_sector}</Typography>
              </>
            ):(
              <Typography color={"#323232"} sx={{width: "45%"}}></Typography>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography color={"#323232"}>
           {`Observação: ${dispatch.observation}`}
          </Typography>
          {dispatch.fileid? (
              <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
                  <Typography sx={{fontSize: 12}} color="red">PDF anexado {">"} </Typography>
                  <a href={`${api.url}/dispatch/pdf/${dispatch.fileid}`} target="_blank">
                      <PictureAsPdfIcon color="error"/>
                  </a>
              </Box>
          ):(null)}
          {dispatch.status? (
              <Typography
                color="#878787"
                sx={{fontSize: 14}}>
                  {`Enviado no dia ${dispatch.date} ||  ~${dispatch.user}`}
                  </Typography>
          ):(
              <Typography
                color="#878787"
                sx={{fontSize: 12}}>
                {`Processo aceito no dia ${dispatch.date}. Aguardando o despache! ||  ~${dispatch.user}`}
              </Typography>
          )}

        </AccordionDetails>
      </Accordion>
      ))}
    </Box>
  );
}