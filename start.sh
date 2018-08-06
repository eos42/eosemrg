# WWW & LOGS 
#
# ################

create_www_dir() {
  # Create LOG directoties for NGINX & PHP-FPM
  echo "Creating www directories"
  mkdir -p /DATA/www
  mkdir -p /DATA/logs

}

apply_www_permissions(){
  echo "Applying www permissions"
  chown -R nginx:nginx /DATA/www /DATA/logs

}



create_www_dir
apply_www_permissions





# Start Supervisor 
echo "Starting Supervisor"
/usr/bin/supervisord -n -c /etc/supervisord.conf

