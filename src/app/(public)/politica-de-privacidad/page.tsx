import { brandConfig } from "@/lib/config/brand.config";

export const metadata = {
  title: "Política de Tratamiento de Datos Personales",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        Política de Tratamiento de Datos Personales
      </h1>
      <p className="mb-8 text-sm text-gray-500">{brandConfig.legalName}</p>

      <div className="space-y-6 text-gray-700">
        <p>
          En cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de 2013 y
          demás normas que las modifiquen o complementen,{" "}
          {brandConfig.legalName} (en adelante, &quot;la Agencia&quot;) pone a
          disposición de los titulares de datos personales la presente
          Política de Tratamiento de Datos Personales.
        </p>

        <section>
          <h2 className="mb-2 font-semibold text-gray-900">
            1. Responsable del tratamiento
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-medium">Razón social:</span>{" "}
              {brandConfig.legalName}
            </li>
            <li>
              <span className="font-medium">NIT:</span> {brandConfig.taxId}
            </li>
            <li>
              <span className="font-medium">Dirección:</span>{" "}
              {brandConfig.address}
            </li>
            <li>
              <span className="font-medium">Correo de contacto:</span>{" "}
              {brandConfig.contactEmail}
            </li>
            <li>
              <span className="font-medium">WhatsApp:</span>{" "}
              {brandConfig.whatsappNumber}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-gray-900">
            2. Datos personales recolectados
          </h2>
          <p className="mb-2">
            A través del sitio web, la Agencia recolecta los siguientes datos
            personales de los visitantes que solicitan información sobre una
            propiedad:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Nombre</li>
            <li>Número de teléfono / WhatsApp</li>
          </ul>
          <p className="mt-2">
            Estos datos son suministrados voluntariamente por el titular al
            momento de solicitar contacto sobre una propiedad publicada en el
            sitio.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-gray-900">
            3. Finalidad del tratamiento
          </h2>
          <p className="mb-2">
            Los datos personales recolectados serán utilizados
            exclusivamente para:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Contactar al titular en relación con la propiedad de su
              interés.
            </li>
            <li>
              Dar respuesta a solicitudes de información sobre inmuebles en
              venta o renta.
            </li>
            <li>
              Fines comerciales y de mercadeo relacionados con los servicios
              inmobiliarios de la Agencia, salvo que el titular manifieste su
              oposición expresa.
            </li>
          </ul>
          <p className="mt-2">
            La Agencia no venderá, cederá ni compartirá estos datos
            personales con terceros no autorizados, salvo requerimiento de
            autoridad competente.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-gray-900">
            4. Derechos del titular de los datos
          </h2>
          <p className="mb-2">
            De acuerdo con el artículo 8 de la Ley 1581 de 2012, el titular
            de los datos personales tiene derecho a:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Conocer, actualizar y rectificar sus datos personales.</li>
            <li>
              Solicitar prueba de la autorización otorgada, salvo que se
              trate de una excepción legal.
            </li>
            <li>
              Ser informado sobre el uso que se ha dado a sus datos
              personales.
            </li>
            <li>
              Presentar quejas ante la Superintendencia de Industria y
              Comercio (SIC) por infracciones a la ley.
            </li>
            <li>
              Revocar la autorización y/o solicitar la supresión del dato,
              cuando no exista un deber legal o contractual que impida
              eliminarlo.
            </li>
            <li>
              Acceder de forma gratuita a sus datos personales que hayan
              sido objeto de tratamiento.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-gray-900">
            5. Procedimiento para ejercer los derechos
          </h2>
          <p className="mb-2">
            El titular puede ejercer sus derechos enviando una solicitud a
            través de:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Correo electrónico: {brandConfig.contactEmail}</li>
            <li>WhatsApp / teléfono: {brandConfig.whatsappNumber}</li>
          </ul>
          <p className="mt-2">
            La Agencia dará respuesta a las consultas en un término máximo
            de diez (10) días hábiles, y a los reclamos en un término máximo
            de quince (15) días hábiles, contados a partir de la fecha de
            recibo de la solicitud, conforme a los términos establecidos en
            la Ley 1581 de 2012.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-gray-900">
            6. Medidas de seguridad
          </h2>
          <p>
            La Agencia adopta medidas técnicas, humanas y administrativas
            razonables para proteger los datos personales contra pérdida,
            uso indebido, acceso no autorizado o alteración. El
            almacenamiento técnico de los datos es realizado mediante
            infraestructura con controles de acceso restringido y cifrado
            en tránsito.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-gray-900">7. Vigencia</h2>
          <p>
            Los datos personales serán conservados durante el tiempo
            necesario para cumplir con la finalidad del tratamiento
            descrita, y en todo caso, mientras subsista la relación
            comercial o el titular no solicite su supresión.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-gray-900">
            8. Autorización
          </h2>
          <p>
            Al diligenciar el formulario de contacto en este sitio web y
            marcar la casilla de aceptación, el titular manifiesta que ha
            leído esta Política y otorga su autorización libre, expresa e
            informada para el tratamiento de sus datos personales conforme
            a los fines aquí descritos.
          </p>
        </section>
      </div>
    </main>
  );
}