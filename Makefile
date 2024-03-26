PHONY: github netlify pudding

github:
	rm -rf docs
	cp -r build docs
	touch docs/.nojekyll
	git add -A
	git commit -m "update github pages"
	git push
	
aws-sync:
	aws s3 sync build s3://pudding.cool/2022/12/yard-sale --delete --cache-control 'max-age=31536000'

aws-cache:
	aws cloudfront create-invalidation --distribution-id E13X38CRR4E04D --paths '/2022/12/yard-sale*'	

pudding: aws-sync aws-cache