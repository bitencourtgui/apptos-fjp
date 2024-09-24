import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  Unstable_Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import TextField from "@mui/material/TextField";

const setBusinessField = (response: any, formik: any) => {
  formik.setFieldValue("business", {
    document: response.cnpj,
    corporateName: response.razao_social,
    cnae: response.cnae_fiscal,
    address: {
      postalCode: response.cep,
      street: response.logradouro,
      number: response.numero,
      complement: response.complemento,
      neighborhood: response.bairro,
      city: response.municipio,
      state: response.uf,
    },
  });
};

export const FormProcesses = (formik: any) => {
  const handleCNPJ = async (document: string) => {
    if (document.length > 11) {
      try {
        const response = await fetch(
          `https://brasilapi.com.br/api/cnpj/v1/${document}`,
        );

        if (!response.ok) {
          throw new Error("Falha ao buscar dados do CNPJ.");
        }

        const data = await response.json();

        setBusinessField(data, formik);
      } catch (error) {
        console.error("Falha ao buscar dados do CEP:", error);
      }
    } else {
      console.error("CNPJ inválido.");
    }
  };

  const handleDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "");

    if (numericValue.length === 14) {
      await handleCNPJ(numericValue);
    }
  };

  return (
    <>
      <Card>
        <CardHeader title="Dados do processo" />
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={3}>
              <FormControl
                error={!!(formik.touched.status && formik.errors.status)}
                fullWidth
              >
                <InputLabel id="status">Status</InputLabel>
                <Select
                  labelId="status"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="archived">Arquivado</MenuItem>
                  <MenuItem value="progress">Andamento</MenuItem>
                  <MenuItem value="suspended">Suspenso</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <FormHelperText>{formik.errors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={!!(formik.touched.number && formik.errors.number)}
                fullWidth
                helperText={formik.touched.number && formik.errors.number}
                label="Número do Processo"
                name="number"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.number}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={!!(formik.touched.class && formik.errors.class)}
                fullWidth
                helperText={formik.touched.class && formik.errors.class}
                label="Classe"
                name="class"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.class}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={!!(formik.touched.subject && formik.errors.subject)}
                fullWidth
                helperText={formik.touched.subject && formik.errors.subject}
                label="Assunto"
                name="subject"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.subject}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={!!(formik.touched.court && formik.errors.court)}
                fullWidth
                helperText={formik.touched.court && formik.errors.court}
                label="Foro"
                name="court"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.court}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={!!(formik.touched.division && formik.errors.division)}
                fullWidth
                helperText={formik.touched.division && formik.errors.division}
                label="Vara"
                name="division"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.division}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={
                  !!(
                    formik.touched.divisionPhone && formik.errors.divisionPhone
                  )
                }
                fullWidth
                helperText={
                  formik.touched.divisionPhone && formik.errors.divisionPhone
                }
                label="Telefone Vara"
                name="divisionPhone"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.divisionPhone}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                error={
                  !!(
                    formik.touched.divisionEmail && formik.errors.divisionEmail
                  )
                }
                fullWidth
                helperText={
                  formik.touched.divisionEmail && formik.errors.divisionEmail
                }
                label="E-mail Vara"
                name="divisionEmail"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.divisionEmail}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="tribunal">Tribunal</InputLabel>
                <Select
                  labelId="tribunal"
                  id="tribunal"
                  name="tribunal"
                  value={formik.values.tribunal}
                  label="Tribunal"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="trt">TRT</MenuItem>
                  <MenuItem value="tse">TSE</MenuItem>
                  <MenuItem value="stj">STJ</MenuItem>
                  <MenuItem value="stm">STM</MenuItem>
                  <MenuItem value="trf1">TRF1</MenuItem>
                  <MenuItem value="trf2">TRF2</MenuItem>
                  <MenuItem value="trf3">TRF3</MenuItem>
                  <MenuItem value="trf4">TRF4</MenuItem>
                  <MenuItem value="trf5">TRF5</MenuItem>
                  <MenuItem value="trf6">TRF6</MenuItem>
                  <MenuItem value="tjac">TJAC</MenuItem>
                  <MenuItem value="tjal">TJAL</MenuItem>
                  <MenuItem value="tjam">TJAM</MenuItem>
                  <MenuItem value="tjap">TJAP</MenuItem>
                  <MenuItem value="tjba">TJBA</MenuItem>
                  <MenuItem value="tjce">TJCE</MenuItem>
                  <MenuItem value="tjdft">TJDFT</MenuItem>
                  <MenuItem value="tjes">TJES</MenuItem>
                  <MenuItem value="tjgo">TJGO</MenuItem>
                  <MenuItem value="tjma">TJMA</MenuItem>
                  <MenuItem value="tjmg">TJMG</MenuItem>
                  <MenuItem value="tjms">TJMS</MenuItem>
                  <MenuItem value="tjmt">TJMT</MenuItem>
                  <MenuItem value="tjpa">TJPA</MenuItem>
                  <MenuItem value="tjpb">TJPB</MenuItem>
                  <MenuItem value="tjpe">TJPE</MenuItem>
                  <MenuItem value="tjpi">TJPI</MenuItem>
                  <MenuItem value="tjpr">TJPR</MenuItem>
                  <MenuItem value="tjrj">TJRJ</MenuItem>
                  <MenuItem value="tjro">TJRO</MenuItem>
                  <MenuItem value="tjrr">TJRR</MenuItem>
                  <MenuItem value="tjrs">TJRS</MenuItem>
                  <MenuItem value="tjsc">TJSC</MenuItem>
                  <MenuItem value="tjse">TJSE</MenuItem>
                  <MenuItem value="tjsp">TJSP</MenuItem>
                  <MenuItem value="tjto">TJTO</MenuItem>
                  <MenuItem value="trt1">TRT1</MenuItem>
                  <MenuItem value="trt2">TRT2</MenuItem>
                  <MenuItem value="trt3">TRT3</MenuItem>
                  <MenuItem value="trt4">TRT4</MenuItem>
                  <MenuItem value="trt5">TRT5</MenuItem>
                  <MenuItem value="trt6">TRT6</MenuItem>
                  <MenuItem value="trt7">TRT7</MenuItem>
                  <MenuItem value="trt8">TRT8</MenuItem>
                  <MenuItem value="trt9">TRT9</MenuItem>
                  <MenuItem value="trt10">TRT10</MenuItem>
                  <MenuItem value="trt11">TRT11</MenuItem>
                  <MenuItem value="trt12">TRT12</MenuItem>
                  <MenuItem value="trt13">TRT13</MenuItem>
                  <MenuItem value="trt14">TRT14</MenuItem>
                  <MenuItem value="trt15">TRT15</MenuItem>
                  <MenuItem value="trt16">TRT16</MenuItem>
                  <MenuItem value="trt17">TRT17</MenuItem>
                  <MenuItem value="trt18">TRT18</MenuItem>
                  <MenuItem value="trt19">TRT19</MenuItem>
                  <MenuItem value="trt20">TRT20</MenuItem>
                  <MenuItem value="trt21">TRT21</MenuItem>
                  <MenuItem value="trt22">TRT22</MenuItem>
                  <MenuItem value="trt23">TRT23</MenuItem>
                  <MenuItem value="trt24">TRT24</MenuItem>
                  <MenuItem value="tre-ac">TRE-AC</MenuItem>
                  <MenuItem value="tre-al">TRE-AL</MenuItem>
                  <MenuItem value="tre-am">TRE-AM</MenuItem>
                  <MenuItem value="tre-ap">TRE-AP</MenuItem>
                  <MenuItem value="tre-ba">TRE-BA</MenuItem>
                  <MenuItem value="tre-ce">TRE-CE</MenuItem>
                  <MenuItem value="tre-dft">TRE-DFT</MenuItem>
                  <MenuItem value="tre-es">TRE-ES</MenuItem>
                  <MenuItem value="tre-go">TRE-GO</MenuItem>
                  <MenuItem value="tre-ma">TRE-MA</MenuItem>
                  <MenuItem value="tre-mg">TRE-MG</MenuItem>
                  <MenuItem value="tre-ms">TRE-MS</MenuItem>
                  <MenuItem value="tre-mt">TRE-MT</MenuItem>
                  <MenuItem value="tre-pa">TRE-PA</MenuItem>
                  <MenuItem value="tre-pb">TRE-PB</MenuItem>
                  <MenuItem value="tre-pe">TRE-PE</MenuItem>
                  <MenuItem value="tre-pi">TRE-PI</MenuItem>
                  <MenuItem value="tre-pr">TRE-PR</MenuItem>
                  <MenuItem value="tre-rj">TRE-RJ</MenuItem>
                  <MenuItem value="tre-rn">TRE-RN</MenuItem>
                  <MenuItem value="tre-ro">TRE-RO</MenuItem>
                  <MenuItem value="tre-rr">TRE-RR</MenuItem>
                  <MenuItem value="tre-rs">TRE-RS</MenuItem>
                  <MenuItem value="tre-sc">TRE-SC</MenuItem>
                  <MenuItem value="tre-se">TRE-SE</MenuItem>
                  <MenuItem value="tre-sp">TRE-SP</MenuItem>
                  <MenuItem value="tre-to">TRE-TO</MenuItem>
                  <MenuItem value="tjmmg">TJMMG</MenuItem>
                  <MenuItem value="tjmrs">TJMRS</MenuItem>
                  <MenuItem value="tjmsp">TJMPS</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="area">Área</InputLabel>
                <Select
                  labelId="area"
                  id="area"
                  name="area"
                  value={formik.values.area}
                  label="Área"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="Civil">Civil</MenuItem>
                  <MenuItem value="Familia">Familia</MenuItem>
                  <MenuItem value="Trabalhista">Trabalhista</MenuItem>
                  <MenuItem value="Indefinido">Indefinido</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>

        {/* partes do processo */}
        <CardHeader title="Partes do processo" />
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.exeqte && formik.errors.exeqte)}
                fullWidth
                helperText={formik.touched.exeqte && formik.errors.exeqte}
                label="Autor"
                name="exeqte"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.exeqte}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.exectdo && formik.errors.exectdo)}
                fullWidth
                helperText={formik.touched.exectdo && formik.errors.exectdo}
                label="Réu"
                name="exectdo"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.exectdo}
              />
            </Grid>
          </Grid>
        </CardContent>

        <CardHeader title="Detalhes do processo" />
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={12}>
              <TextField
                error={!!(formik.touched.extra && formik.errors.extra)}
                fullWidth
                helperText={formik.touched.extra && formik.errors.extra}
                label="Observações"
                name="extra"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.extra}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};
