FROM odoo:19

USER root

COPY requirements.txt /tmp/requirements.txt

# Evita desinstalar paquetes de Debian y sube typing-extensions
RUN pip3 install --no-cache-dir --break-system-packages --ignore-installed "typing_extensions>=4.12" \
 && pip3 install --no-cache-dir --break-system-packages --ignore-installed -r /tmp/requirements.txt

USER odoo
